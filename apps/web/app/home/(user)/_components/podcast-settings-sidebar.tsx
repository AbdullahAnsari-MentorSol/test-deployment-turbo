import { Settings } from 'lucide-react';
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
  } from '@kit/ui/drawer';
import { PodcastSettingsForm } from './podcast-settings-form';
  
  export default function PodcastSettingsSidebar(
    props: React.PropsWithChildren<{
      userId: string;
    }>,
  ) {
    return (
      <div>
        <Drawer>
          <DrawerTrigger asChild>
            <button className="btn-primary p-4"><Settings/></button>
          </DrawerTrigger>
          <DrawerContent side="right">
            <DrawerHeader>
              <DrawerTitle>Podcast Settings</DrawerTitle>
            </DrawerHeader>
            <PodcastSettingsForm userId={props.userId}/>
            <DrawerFooter>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }
  